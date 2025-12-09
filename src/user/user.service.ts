import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserDTO } from 'src/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

 
  async findBySteamID(steamid64: string) {
    return this.prisma.user.findUnique({
      where: { steamid64 },
    });
  }

  
  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  
  async verifyOrAdd(userDTO: UserDTO) {
    if (!userDTO.steamid64) {
      throw new Error('steamid64 is required');
    }

    let user = await this.prisma.user.findUnique({
      where: { steamid64: userDTO.steamid64 },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          steamid64: userDTO.steamid64,
          name: userDTO.name,
          avatar: userDTO.avatar,
          profile_url: userDTO.profile_url,
          real_name: userDTO.real_name,
          last_online: userDTO.last_online,
          sid: userDTO.sid,
        },
      });
    }

    return user;
  }
}


















// import { Injectable } from '@nestjs/common';
// import { UserDTO } from 'src/dto/user.dto';

// @Injectable()
// export class UserService {
//   private users = new Map<string, UserDTO>();

  
//   async findBySteamID(steamid64: string): Promise<UserDTO | null> {
//     return this.users.get(steamid64) || null;
//   }

 

//   async findById(id: number) {
//   for (const user of this.users.values()) {
//     if (user.id === id) return user;
//   }
//   return null;
// }


//   async verifyOrAdd(userDTO: UserDTO): Promise<UserDTO> {
//     if (!userDTO.steamid64) {
//       throw new Error('steamid64 is required');
//     }

//     if (!this.users.has(userDTO.steamid64)) {
//       const id = Math.floor(Math.random() * 100000);
//       this.users.set(userDTO.steamid64, { ...userDTO, id });
//     }

//     return this.users.get(userDTO.steamid64)!;
//   }










































  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all user`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
// }



// @Injectable()
// export class UserService {
//   constructor(private prisma: PrismaService) {}

//   // ---------- used by Steam OAuth ----------
//   async findBySteamId(steamId: string) {
//     return this.prisma.users.findUnique({
//       where: { steamId },
//     });
//   }

//   async createSteamUser(data: { steamId: string; nickname: string; avatar?: string }) {
//     return this.prisma.users.create({ data });
//   }

//   // ---------- CRUD for UserController ----------
//   async create(data: any) {
//     return this.prisma.users.create({ data });
//   }

//   async findAll() {
//     return this.prisma.users.findMany();
//   }

//   async findById(id: number) {
//   return this.prisma.users.findUnique({
//     where: { id },
//   });
// }

//   async findOne(id: number) {
//     return this.prisma.users.findUnique({ where: { id } });
//   }

//   async update(id: number, data: any) {
//     return this.prisma.users.update({
//       where: { id },
//       data,
//     });
//   }

//   async remove(id: number) {
//     return this.prisma.users.delete({
//       where: { id },
//     });
//   }
// }




// import { Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Injectable()
// export class UserService {
//   create(createUserDto: CreateUserDto) {
//     return 'This action adds a new user';
//   }

//   findAll() {
//     return `This action returns all user`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} user`;
//   }

//   update(id: number, updateUserDto: UpdateUserDto) {
//     return `This action updates a #${id} user`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} user`;
//   }
// }
