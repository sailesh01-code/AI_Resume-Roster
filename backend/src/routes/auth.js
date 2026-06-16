const express = require("express");
const { z } = require("zod");

const env = require("../config/env");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { signToken, cookieOptions } = require("../utils/jwt");
const { validate } = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimit");
const User = require("../models/User");

const router = express.Router();

const registerSchema = z.object({
    name: z.string().trim().min(1).max(80),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).max(128),
});

const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1).max(128),
});

const profileSchema = z.object({
    name: z.string().trim().min(1).max(80),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1).max(128),
    newPassword: z.string().min(8).max(128),
});

function issueSession(res, user) {
    const token = signToken({ sub: user._id.toString() });
    res.cookie(env.cookieName, token, cookieOptions);
}

router.post(
    "/register",
    authLimiter,
    validate(registerSchema),
    asyncHandler(async (req, res) => {
        const { name, email, password } = req.body;
        const passwordHash = await User.hashPassword(password);
        const user = await User.create({ name, email, passwordHash });

        issueSession(res, user);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    })
);

router.post(
    "/login",
    authLimiter,
    validate(loginSchema),
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+passwordHash");

        if (!user) {
            throw ApiError.unauthorized("Invalid credentials");
        }

        const ok = await user.comparePassword(password);

        if (!ok) {
            throw ApiError.unauthorized("Invalid credentials");
        }

        issueSession(res, user);

        res.json({ user });
    })
);

router.post("/logout", (req, res) => {
    res.clearCookie(env.cookieName, {
        ...cookieOptions,
        maxAge: 0,
    });

    res.json({ ok: true });
});

router.get(
    "/me",
    requireAuth,
    asyncHandler(async (req, res) => {
        res.json({ user: req.user });
    })
);

router.patch(
    "/profile",
    requireAuth,
    validate(profileSchema),
    asyncHandler(async (req, res) => {
        req.user.name = req.body.name;
        await req.user.save();

        res.json({ user: req.user });
    })
);

module.exports = router;