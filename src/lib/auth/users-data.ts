import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  password: string; // hashed
  fullName: string;
  phone: string | null;
  role: 'customer' | 'shaman' | 'admin';
  avatarUrl: string | null;
  createdAt: string;
}

// 비밀번호: password123
const hashedPassword = bcrypt.hashSync('password123', 10);

// 더미 사용자 데이터
export const DUMMY_USERS: User[] = [
  {
    id: '1',
    email: 'customer@test.com',
    password: hashedPassword,
    fullName: '김고객',
    phone: '010-1234-5678',
    role: 'customer',
    avatarUrl: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'shaman@test.com',
    password: hashedPassword,
    fullName: '박무속',
    phone: '010-2345-6789',
    role: 'shaman',
    avatarUrl: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'admin@test.com',
    password: hashedPassword,
    fullName: '이관리',
    phone: '010-3456-7890',
    role: 'admin',
    avatarUrl: null,
    createdAt: new Date().toISOString(),
  },
];

// 이메일로 사용자 찾기
export function findUserByEmail(email: string): User | undefined {
  return DUMMY_USERS.find(user => user.email === email);
}

// ID로 사용자 찾기
export function findUserById(id: string): User | undefined {
  return DUMMY_USERS.find(user => user.id === id);
}

// 비밀번호 검증
export function verifyPassword(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}

// 사용자 정보 (비밀번호 제외)
export function getUserWithoutPassword(user: User) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
