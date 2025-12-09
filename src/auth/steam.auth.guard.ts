import { ExecutionContext, Injectable, } from "@nestjs/common";
import { AuthGuard, IAuthModuleOptions } from "@nestjs/passport";

@Injectable()
export class SteamAuthGuard extends AuthGuard("steam") {
    getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions {
        return { failureRedirect: '/login' };
    }
}