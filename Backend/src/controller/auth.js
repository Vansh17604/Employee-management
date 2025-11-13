const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { check, validationResult } = require('express-validator');

dotenv.config();


module.exports.ScrapeData = [async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, error: "URL is required" });
  }

  let browser;
  try {
    // Launch headless browser
    browser = await chromium.launch({ headless: true });
    const page = await (await browser.newContext()).newPage();

    // Navigate and wait for full load
    await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });

    // Wait a bit for dynamic content to render
    await page.waitForTimeout(1000);

    // Scrape all relevant information
    const scrapedData = await page.evaluate(() => {
      const getMeta = (name) => {
        const el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
        return el ? el.getAttribute("content") : null;
      };

      return {
        title: document.title || null,
        url: window.location.href,
        description: getMeta("description"),
        keywords: getMeta("keywords"),
        ogTitle: getMeta("og:title"),
        ogDescription: getMeta("og:description"),
        ogImage: getMeta("og:image"),
        headings: Array.from(document.querySelectorAll("h1, h2, h3")).map(h => ({
          tag: h.tagName,
          text: h.textContent?.trim()
        })),
        paragraphs: Array.from(document.querySelectorAll("p")).map(p => p.textContent?.trim()).filter(Boolean),
        links: Array.from(document.querySelectorAll("a"))
          .map(a => ({ text: a.textContent?.trim(), href: a.href }))
          .filter(l => l.href && !l.href.startsWith("javascript:")),
        images: Array.from(document.querySelectorAll("img"))
          .map(img => ({ src: img.src, alt: img.alt || null }))
          .filter(img => img.src),
        allText: document.body.innerText.trim().replace(/\s+/g, " "),
      };
    });

    // Optionally capture a screenshot
    const screenshot = await page.screenshot({ encoding: "base64", fullPage: true });

    await browser.close();

    res.json({
      success: true,
      data: scrapedData,
      screenshot,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (browser) await browser.close();
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}]
module.exports.RegisterAdmin = [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').not().isEmpty().withMessage("Email is required"),
    check('email').isEmail().withMessage("Invalid email"),
    check('password').not().isEmpty().withMessage("Password is required"),
    check('password').isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
        async(req,res)=>{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
                }
                const { name, email, password } = req.body;
                
                const user = new User({
                    name,
                    email,
                    password,
                    role: 'admin'
                    });
                    try {
                        
                        const savedUser = await user.save();
                        res.json({ message: 'Admin created successfully', user: savedUser });
                        } catch (err) {
                            res.status(400).json({ message: 'Error creating admin', error: err });
                            }
                            
        }
]



module.exports.RegisterEmployee = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').not().isEmpty().withMessage('Email is required'),
  check('email').isEmail().withMessage('Invalid email'),
  check('password').not().isEmpty().withMessage('Password is required'),
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const user = new User({
        name,
        email,
        password,
        role: 'employee'
      });

      const savedUser = await user.save();
      res.json({ message: 'Employee created successfully', user: savedUser });

    } catch (err) {
      res.status(400).json({ message: 'Error creating employee', error: err });
    }
  }
];


module.exports.RegisterNormalEmployee = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').not().isEmpty().withMessage('Email is required'),
  check('email').isEmail().withMessage('Invalid email'),
  check('password').not().isEmpty().withMessage('Password is required'),
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const user = new User({
        name,
        email,
        password,
        role: 'normalemployee'
      });

      const savedUser = await user.save();
      res.json({ message: 'Normal Employee created successfully', user: savedUser });

    } catch (err) {
      res.status(400).json({ message: 'Error creating normal employee', error: err });
    }
  }
];


module.exports.Login = [
    check('email').isEmail().withMessage('Please enter a valid email'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                {
                    id: user._id,
                    role: user.role
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' }
            );

            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000 // 1 hour
            });

            res.json({ id: user._id, role: user.role, token });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Login failed');
        }
    }
];


module.exports.validateToken = async (req, res) => {
    try {
        const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];


        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: user._id,
            role: user.role
        });
    } catch (err) {
        console.error(err.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};


module.exports.GetUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err });
    }
};


module.exports.UpdateUserProfile = [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email } = req.body;

        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.name = name;
            user.email = email;

            const updatedUser = await user.save();
            const userResponse = updatedUser.toObject();
            delete userResponse.password;

            res.json({ message: 'Profile updated successfully', user: userResponse });
        } catch (err) {
            res.status(500).json({ message: 'Error updating profile', error: err });
        }
    }
];


module.exports.ChangePassword = [
    check('oldPassword').not().isEmpty().withMessage('Old password is required'),
    check('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { oldPassword, newPassword } = req.body;

        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }

            
            user.password = newPassword
            await user.save();

            res.json({ message: 'Password changed successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Error changing password', error: err });
        }
    }
];


module.exports.Logout = (req, res) => {
    try {
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error logging out', error: err });
    }
};



