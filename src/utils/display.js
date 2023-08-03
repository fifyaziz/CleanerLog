//screenType : ['Add','Edit']
//serviceAreaType : ["",'Tandas', 'Surau', 'Pejabat']

export const displayTypeName = (val) => {
  switch (val) {
    case 1:
      return 'Tandas';
    case 2:
      return 'Surau';
    case 3:
      return 'Pejabat';
    default:
      return '(Nama)';
  }
};

export const displayBuilding = (val) => {
  switch (val) {
    case 'mall':
      return 'Mall';
    case 'T1':
      return 'Tower 1';
    case 'T2':
      return 'Tower 2';
    case 'T3':
      return 'Tower 3';
    default:
      return '(Building)';
  }
};

export const displayGender = (val) => {
  switch (val) {
    case 0:
      return '';
    case 1:
      return 'Lelaki';
    case 2:
      return 'Perempuan';
    default:
      return '(Jantina)';
  }
};

export const displayShotformGender = (val) => {
  switch (val) {
    case 0:
      return '';
    case 1:
      return '(L)';
    case 2:
      return '(P)';
    default:
      return '(Jantina)';
  }
};
