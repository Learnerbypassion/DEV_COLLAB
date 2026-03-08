import bcrypt from "bcryptjs";
export const hashCredential = async (Credential)=>{
    return await bcrypt.hash(Credential, 10)
}