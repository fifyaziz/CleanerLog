export const dateTimeFormat = (datetime) => {
  const date = new Date(datetime);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year} ${
    hours < 10 ? '0' + hours : hours
  }:${minutes < 10 ? '0' + minutes : minutes}`;
};

export const dayDateFormat = (datetime) => {
  const weekday = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];

  const date = new Date(datetime);
  const d = date.getDay();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${weekday[d]} - ${day < 10 ? '0' + day : day}/${
    month < 10 ? '0' + month : month
  }/${year}`;
};

export const dateTimeAPIFormat = (datetime) => {
  const date = new Date(datetime);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${year}-${month}-${day}T${hours}:${minutes}:00.000 GMT`;
};
