import { app } from "./modules/config-app.js";
import { firebaseCRUD } from "./modules/crud.js";
import { authEmail } from "./modules/auth-email.js";
import { authGitHub } from "./modules/auth-github.js";
import { authGoogle } from "./modules/auth-google.js";
import { firebaseStorage } from "./modules/storage.js";

//console.log(app);
firebaseCRUD(app);
authEmail(app);
authGitHub(app);
authGoogle(app);
firebaseStorage(app);
