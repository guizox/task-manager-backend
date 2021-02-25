import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCrendentialsDTO: AuthCredentialsDTO,
  ): Promise<void> {
    return this.authService.signUp(authCrendentialsDTO);
  }

  @Post('/sign-in')
  signIn(
    @Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken }> {
    return this.authService.signIn(authCredentialsDTO);
  }

  @Post('/teste')
  @UseGuards(AuthGuard())
  test(@GetUser() user) {
    console.log(user);
  }
}
