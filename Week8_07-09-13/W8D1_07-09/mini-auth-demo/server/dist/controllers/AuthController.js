export class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    cookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/api/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (typeof email !== 'string' || typeof password !== 'string' || email.trim() === '' || password === '') {
                res.status(400).json({ error: 'Email and password are required' });
                return;
            }
            const result = await this.authService.login({ email, password });
            res.cookie('refreshToken', result.refreshToken, this.cookieOptions);
            res.status(200).json({ token: result.accessToken });
        }
        catch (err) {
            if (err instanceof Error && err.message === 'Invalid credentials') {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            res.status(500).json({ error: 'Internal Server error' });
        }
    };
    refresh = async (req, res) => {
        try {
            const incomingRefreshToken = req.cookies?.refreshToken;
            if (!incomingRefreshToken) {
                res.status(401).json({ error: 'Refresh token missing' });
                return;
            }
            const result = await this.authService.refresh(incomingRefreshToken);
            res.cookie('refreshToken', result.refreshToken, this.cookieOptions);
            res.status(200).json({ token: result.accessToken });
        }
        catch (err) {
            if (err instanceof Error) {
                res.status(401).json({ error: 'Invalid or expired refresh session' });
                return;
            }
            res.status(500).json({ error: 'Internal Server error' });
        }
    };
    logout = async (req, res) => {
        try {
            const incomingRefreshToken = req.cookies?.refreshToken;
            if (incomingRefreshToken) {
                await this.authService.logout(incomingRefreshToken);
            }
            // Clear cookie by matching all settings except maxAge
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/api/auth',
            });
            res.status(200).json({ message: 'Logged out successfully' });
        }
        catch (err) {
            res.status(500).json({ error: 'Internal Server error' });
        }
    };
}
//# sourceMappingURL=AuthController.js.map