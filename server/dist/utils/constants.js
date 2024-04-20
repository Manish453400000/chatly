"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availableUserRoles = exports.userRolesEnum = exports.DB_NAME = void 0;
exports.DB_NAME = 'whisperClock';
exports.userRolesEnum = {
    ADMIN: "ADMIN",
    USER: "USER",
};
exports.availableUserRoles = Object.values(exports.userRolesEnum);
console.log(exports.availableUserRoles);
