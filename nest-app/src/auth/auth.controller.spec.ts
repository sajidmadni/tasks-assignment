import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = () => ({
  register: jest.fn((email, password, role) => ({
    email,
    password: 'hashed', // Simulating a hashed password
    role: role || 'user', // Default role
  })),
  login: jest.fn(),
});

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useFactory: mockAuthService }], // Add AuthService mock
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return the created user', async () => {
      const mockUser = { email: 'test@example.com', password: 'hashed', role: 'user' };
  
      authService.register = jest.fn().mockResolvedValue(mockUser);
  
      const result = await authController.register({
        email: 'test@example.com',
        password: 'password',
        role: 'user',
      });
  
      expect(authService.register).toHaveBeenCalledWith('test@example.com', 'password', 'user');
      expect(result).toEqual(mockUser);
    });
  });
  
});
