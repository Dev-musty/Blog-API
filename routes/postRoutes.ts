import JWTService from "../services/jwtService";
import ProtectRoute from "../middleware/protect";


const jwtService = new JWTService();
const protectRoute = new ProtectRoute(jwtService);
