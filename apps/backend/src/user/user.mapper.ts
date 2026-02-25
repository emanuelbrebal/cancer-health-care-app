import { User } from '@prisma/client';

export class UserMapper {
  static toDto(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      pronoun: user.pronoun,
      phone_number: user.phone_number,
      birthday: user.birthday,
      profile_picture: user.profile_picture,
      createdAt: user.createdAt,
    };
  }
}