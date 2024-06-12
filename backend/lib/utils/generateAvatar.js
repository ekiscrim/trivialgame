const avatars = [
    '/avatars/boy1.png',
    '/avatars/boy2.png',
    '/avatars/boy3.png',
    '/avatars/girl1.png',
    '/avatars/girl2.png',
    '/avatars/girl3.png'
  ];
  
export const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * avatars.length);
    return avatars[randomIndex];
}