
import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { randomBytes, timingSafeEqual } from "node:crypto";

const router = Router();

const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL!;
const JWT_SECRET = process.env.JWT_SECRET!;

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  CALLBACK_URL
);

const cookieOptions = {
  httpOnly: true,
  secure: false, // Local HTTP development only
  sameSite: "lax" as const,
  path: "/",
};

// 1. Start Google login
router.get("/google", (req, res) => {
  const state = randomBytes(32).toString("hex");

  res.cookie("oauth_state", state, {
    ...cookieOptions,
    maxAge: 5 * 60 * 1000,
  });

  const authUrl = googleClient.generateAuthUrl({
    access_type: "online",
    scope: ["openid", "email", "profile"],
    state,
    prompt: "select_account",
  });

  res.redirect(authUrl);

  const parsedUrl = new URL(authUrl);

console.log(
  "Generated URL has client_id:",
  Boolean(parsedUrl.searchParams.get("client_id"))
);
});

// 2. Google OAuth callback
router.get("/google/callback", async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.status(400).send("Google login was cancelled or denied.");
    }

    const savedState = req.cookies.oauth_state as string | undefined;

    res.clearCookie("oauth_state", { path: "/" });

    if (
      typeof state !== "string" ||
      !savedState ||
      state.length !== savedState.length ||
      !timingSafeEqual(
        Buffer.from(state),
        Buffer.from(savedState)
      )
    ) {
      return res.status(400).send("Invalid OAuth state.");
    }

    if (typeof code !== "string") {
      return res.status(400).send("Authorization code missing.");
    }

    // Exchange authorization code for Google tokens
    const { tokens } = await googleClient.getToken(code);

    if (!tokens.id_token) {
      return res.status(401).send("Google ID token missing.");
    }

    // Verify Google's ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.sub) {
      return res.status(401).send("Invalid Google user.");
    }

    // Create our application's own JWT
    const appToken = jwt.sign(
      {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store application JWT in HTTP-only cookie
    res.cookie("app_token", appToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });

    // Redirect to React profile page
    return res.redirect(`${CLIENT_URL}/profile`);
  } catch (error) {
    console.error("Google OAuth error:", error);
    return res.status(500).send("Google login failed.");
  }
});

// 3. Get authenticated user's profile
router.get("/me", (req, res) => {
  try {
    const token = req.cookies.app_token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const user = jwt.verify(token, JWT_SECRET);

    return res.json({ user });
  } catch {
    return res.status(401).json({
      message: "Invalid or expired session",
    });
  }
});

// 4. Logout
router.post("/logout", (req, res) => {
  res.clearCookie("app_token", { path: "/" });

  return res.json({
    message: "Logged out successfully",
  });
});

export default router;
