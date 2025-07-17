export interface UserFixture {
  email: string;
  password: string;
  name: string;
}

export const sampleUser: UserFixture = {
  email: "testuser@example.com",
  password: "TestPassword123!",
  name: "Test User"
}; 