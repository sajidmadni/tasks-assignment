import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common'; // Import UnauthorizedException

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) // Inject User Repository
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(email: string, password: string, role: string = 'user'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); // Ensure hashing
  
    const user = this.userRepository.create({
      email,
      password: hashedPassword, // Save hashed password
      role: role,
    });
  
    return await this.userRepository.save(user);
  }

  async login(email: string, password: string) {
    
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
        
    // Ensure password has no hidden spaces
    const enteredPassword = password.trim();
  
    // Compare entered password with stored hash
    const isPasswordValid = await bcrypt.compare(enteredPassword, user.password);
  
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    return {
      // user: user,
      access_token: this.jwtService.sign({ id: user.id, role: user.role }),
    };
  }
}
