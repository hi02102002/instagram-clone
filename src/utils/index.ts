export const uppercaseFirstLetter = (str: string) => {
   return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getConversationName = (
   members: { _avatar: string; _username: string }[],
   currentUsername: string
): string => {
   if (members.length === 2) {
      return members.find((_member) => _member._username !== currentUsername)
         ?._username as string;
   }
   return members
      .map((_member) =>
         _member._username === currentUsername ? 'You' : _member._username
      )
      .join(', ');
};

export const compareArrMember = (
   members1: {
      _avatar: string;
      _username: string;
   }[],
   members2: {
      _avatar: string;
      _username: string;
   }[]
) => {
   if (
      !Array.isArray(members1) ||
      !Array.isArray(members2) ||
      members1.length !== members2.length
   ) {
      return false;
   }
   const members1Sorted = [...members1].sort((a, b) =>
      a._username.localeCompare(b._username)
   );
   const members2Sorted = [...members2].sort((a, b) =>
      a._username.localeCompare(b._username)
   );

   for (let i = 0; i < members1Sorted.length; i++) {
      if (members1Sorted[i]._username !== members2Sorted[i]._username) {
         return false;
      }
   }
   return true;
};
