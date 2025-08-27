import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

passport.use(new LocalStrategy(
  { usernameField: "email" },   // if using email instead of username
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: "No user found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: "Wrong password" });

      return done(null, user); // success
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize user -> session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user <- session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
