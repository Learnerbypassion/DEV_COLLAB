import bcrypt from "bcryptjs";

export const compareCredential = async (inputCredential, actualCredential) => {
    return await bcrypt.compare(inputCredential, actualCredential)
}