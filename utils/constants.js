const SUCCESS_CODE = 200;
const CREATED_CODE = 201;
const RegExp = /^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

module.exports = {
  SUCCESS_CODE,
  CREATED_CODE,
  RegExp,
};
