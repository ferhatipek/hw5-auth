import userCollection from '../db/models/user.js';
import bcrypt from 'bcrypt';
import sessionCollection from '../db/models/session.js';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/user.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifetime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifetime);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const register = async (payload) => {
  const { email, password } = payload;

  const user = await userCollection.findOne({ email }); // Changed from UserCollection to userCollection
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const data = await userCollection.create({
    // Changed from UserCollection to userCollection
    ...payload,
    password: hashPassword,
  });
  delete data._doc.password;

  return data._doc;
};

export const login = async (payload) => {
  const { email, password } = payload;
  const user = await userCollection.findOne({ email }); // Changed from UserCollection to userCollection
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await sessionCollection.deleteOne({ userId: user._id }); // Changed from SessionCollection to sessionCollection

  const sessionData = createSession();

  const userSession = await sessionCollection.create({
    // Changed from SessionCollection to sessionCollection
    userId: user._id,
    ...sessionData,
  });

  return userSession;
};

export const findSessionByAccessToken = (accessToken) =>
  sessionCollection.findOne({ accessToken });

export const refreshSession = async ({ refreshToken, sessionId }) => {
  const oldSession = await sessionCollection.findOne({
    // Changed from SessionCollection
    _id: sessionId,
    refreshToken,
  });

  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }

  await sessionCollection.deleteOne({ _id: sessionId }); // Changed from SessionCollection

  const sessionData = createSession();

  const userSession = await sessionCollection.create({
    // Changed from SessionCollection
    userId: oldSession._id,
    ...sessionData,
  });

  return userSession;
};

export const logout = async (sessionId) => {
  await sessionCollection.deleteOne({ _id: sessionId }); // Changed from SessionCollection
};

export const findUser = (filter) => userCollection.findOne(filter);
