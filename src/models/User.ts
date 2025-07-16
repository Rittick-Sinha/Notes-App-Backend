import mongoose,{Schema, Document} from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUser extends Document{
    name: string;
    email:string;
    mobile:string;
    password:string;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        name:{type:String, required:true},
        email:{type:String, required:true, unique:true},
        mobile:{type:String, required:true, unique:true},
        password:{type:String, required:true},
    },
    {timestamps:true}
);

UserSchema.pre<IUser>("save", async function(next){
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = function(candidatePassword: string){
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);