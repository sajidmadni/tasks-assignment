import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

const mockJwtService = () => ({
  sign: jest.fn().mockReturnValue('valid_token'), // Mock JWT token generation
});

// ✅ Define mock repository type
type MockType<T> = {
  [P in keyof T]?: jest.Mock<any, any>;
};

const mockUserRepository = (): MockType<Repository<User>> => ({
  findOne: jest.fn(),
  create: jest.fn().mockImplementation((user) => user), // Mock implementation
  save: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: MockType<Repository<User>>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        { provide: JwtService, useFactory: mockJwtService }, // Inject Mock JWT Service
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService); // Ensure JWT Service is available
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const user = {
        email: 'test@example.com',
        password: 'hashed',
        role: 'user',
      } as User;

      userRepository.create?.mockReturnValue(user);
      userRepository.save?.mockResolvedValue(user);

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);

      const result = await authService.register('test@example.com', 'password');

      expect(userRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashed',
        role: 'user',
      });

      expect(userRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('login', () => {
    it('should return a JWT token when credentials are valid', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashed' } as User;
      userRepository.findOne?.mockResolvedValue(user);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.login('test@example.com', 'password');

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(jwtService.sign).toHaveBeenCalled(); // Ensure JWT sign function is called
      expect(result).toEqual({ access_token: 'valid_token' }); // Ensure correct token is returned
    });

    it('should throw error if credentials are invalid', async () => {
      userRepository.findOne?.mockResolvedValue(null);

      await expect(authService.login('test@example.com', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
