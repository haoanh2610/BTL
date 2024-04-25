const userService = require("../services/userService");
const jwt = require("jsonwebtoken");
var refreshTokens = [];

let requestRefreshToken = async (req, res) => {
  //Take refresh token from user
  console.log(req.cookies);
  const refreshToken = req.cookies.refreshToken;
  //Send error if token is not valid
  if (!refreshToken) return res.status(401).json("You're not authenticated");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid");
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) {
      console.log(err);
    }
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    //create new access token, refresh token and send to user
    const newAccessToken = userService.generateAccessToken(user);
    const newRefreshToken = userService.generateRefreshToken(user);
    refreshTokens.push(newRefreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
};

let handleUserRegister = async (req, res) => {
  let message = await userService.userRegister(req.body);
  return res.status(200).json(message);
};

let handleUserLogin = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }

  let userData = await userService.userLogin(username, password, res);
  // access_token:JWT json web token
  refreshTokens.push(userData.refreshToken);
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
    accessToken: userData.accessToken,
    refreshToken: userData.refreshToken,
  });
};

let handleCreateUser = async (req, res) => {
  let message = await userService.createUser(req.body);
  return res.status(200).json(message);
};

let handleGetAllUser = async (req, res) => {
  let message = await userService.getAllUser(req.body);
  return res.status(200).json(message);
};

let getDetailUserById = async (req, res) => {
  try {
    let infor = await userService.getDetailUserById(req.params.id);
    return res.status(200).json(infor);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let handleEditUser = async (req, res) => {
  let message = await userService.editUser(req.body);
  return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
  if (!req.params.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
    });
  }
  let message = await userService.deleteUser(req.params.id);
  return res.status(200).json(message);
};

let handleUserLogOut = (req, res) => {
  //Clear cookies when user logs out
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.clearCookie("refreshToken");
  res.status(200).json("Logged out successfully!");
};

module.exports = {
  requestRefreshToken: requestRefreshToken,
  handleUserRegister: handleUserRegister,
  handleUserLogin: handleUserLogin,
  handleUserLogOut: handleUserLogOut,
  handleCreateUser: handleCreateUser,
  handleGetAllUser: handleGetAllUser,
  getDetailUserById: getDetailUserById,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
};
