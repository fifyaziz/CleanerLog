export const dateTimeFormat = (datetime) => {
  if (datetime) {
    const a = datetime?.split('T' || ' ');
    const b = a[0].split('-');
    const c = a[1].split(':');

    var date = new Date(b[0], b[1], b[2], c[0], c[1]);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    var hours = date.getHours();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutes = date.getMinutes();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year} ${
      hours < 10 ? '0' + hours : hours
    }:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  }
  return null;
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

export const dateFormat = (datetime) => {
  const date = new Date(datetime);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
};

export const dateSlashFormat = (date) => {
  const a = `${date}`?.split('T');
  const b = a?.[0]?.split('-');
  const c = a?.[1]?.split(':');

  var tempDate = new Date(b[0], b[1], b[2], c[0], c[1]);
  const day = tempDate.getDate();
  const month = tempDate.getMonth();
  const year = tempDate.getFullYear();
  return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
};

export const timeFormat = (date) => {
  if (date) {
    const a = `${date}`?.split('T');
    const b = a?.[0]?.split('-');
    const c = a?.[1]?.split(':');

    var tempDate = new Date(b[0], b[1], b[2], c[0], c[1]);
    var hours = tempDate.getHours();
    var minutes = tempDate.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
};

export const pickerTimeFormat = (date) => {
  var tempDate = new Date(date) || new Date();
  var hours = tempDate.getHours();
  var minutes = tempDate.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};

export const dateTimeAPIFormat = (datetime) => {
  const date = new Date(datetime) || new Date();
  var day = date.getDate();
  day = day < 10 ? '0' + day : day;
  var month = date.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  const year = date.getFullYear();
  var hours = date.getHours();
  hours = hours < 10 ? '0' + hours : hours;
  var minutes = date.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var seconds = date.getSeconds();
  seconds = seconds < 10 ? '0' + seconds : seconds;
  const miliSeconds = date.getMilliseconds();
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${miliSeconds}`;
};

export const dateAPIFormat = (datetime) => {
  const date = new Date(datetime);
  var day = date.getDate();
  day = day < 10 ? '0' + day : day;
  var month = date.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};
