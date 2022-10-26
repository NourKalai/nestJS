import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../user/entities/user.entity';
//Décorateur récupérable via @user
export const User = createParamDecorator(
    (data: UserEntity, ctx: ExecutionContext):ParameterDecorator => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);