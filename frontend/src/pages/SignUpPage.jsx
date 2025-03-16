import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignUpPage = () => {
    const [showpassword, setShowpassoword] = useState(false);
    const [formData, setFormData] = useState({});

    const {signUp , isSigningUp } = useAuthStore();

    const validateForm =()=>{
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


        if(!formData?.fullName?.trim()) return toast.error("Full name is required");
        if(!formData?.email?.trim()) return toast.error("Full name is required");

        if(!emailRegex.test(formData?.email)) return toast.error("Invalid email format");
        if(!formData?.password) return toast.error("Password is requires");

        if(formData?.password.length < 6) return toast.error("Password must have more than 6 characters");

        return true
    };

    const handleChange =(e)=>{
        let {name , value } = e.target;
        setFormData({
            ...formData,
            [name] : value
        })
    };

    const handleSubmit =  (e)=>{
        e.preventDefault();
        const success = validateForm();
        if(success === true){
            signUp(formData);
        }
    }

  return (
      <div className='min-h-screen grid lg:grid-cols-2'>
          {/* left side of form  */}

          <div className='flex flex-col justify-center items-center p-6 sm:p-12'>

              <div className='w-full max-w-md space-y-8'>
                  {/* logo start  */}
                  <div className="text-center mb-8">
                      <div className="flex flex-col items-center gap-2 group">
                          <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                         group-hover:bg-primary/20 transition-colors'>
                              <MessageSquare className='size-6 text-primary' />
                          </div>
                          <h1 className="text-2xl font-bold mt-2">
                              Create Account
                          </h1>
                          <p className='text-base-content/60'>
                              Get started with your free account
                          </p>
                      </div>

                  </div>
                  {/* logo end  */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control">
                        <label  className="label">
                            <span className="label-text font-medium">
                                Full Name
                            </span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className='size-5 text-base-content/40'/>
                            </div>
                            <input type="text"
                            className="input bordered w-full pl-10" 
                            placeholder='Enter Full Name'
                            value={formData?.fullName}
                            name='fullName'
                            onChange={handleChange}
                            
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label  className="label">
                            <span className="label-text font-medium">
                                Email
                            </span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className='size-5 text-base-content/40'/>
                            </div>
                            <input type="email"
                            className="input bordered w-full pl-10" 
                            placeholder='you@example.com'
                            value={formData?.email}
                            name='email'
                            onChange={handleChange}
                            
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label  className="label">
                            <span className="label-text font-medium">
                                Password
                            </span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className='size-5 text-base-content/40'/>
                            </div>
                            <input type={showpassword ? "text" : "password"}
                            className="input bordered w-full pl-10" 
                            placeholder='********'
                            value={formData?.password}
                            name='password'
                            onChange={handleChange}
                            
                            />
                            <button 
                            type='button'
                            className='absolute inset-y-0 right-0 pr-3 flex items-center'
                            onClick={()=> setShowpassoword(!showpassword)}
                            >
                                {showpassword ? (
                                    <EyeOff className='size-5 text-base-content/40'/>
                                ) : 
                                (
                                    <Eye className='size-5 text-base-content/40'/>
                                )}

                            </button>
                            

                        
                        </div>
                    </div>
                    <button className="btn btn-primary w-full" disabled={isSigningUp}>

                        {isSigningUp ? (
                            <>
                            <Loader2 className='size-5 animate-spin'/>
                            Loading...</>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                  </form>
                  <div className="text-center">
                    <p className="text-base-content/60">
                    Already have and account {" "}
                    <Link  to="/login" className='link link-primary'>
                    Sign in
                    </Link>
                    </p>
                    
                  </div>
              </div>
          </div>

          {/* left side of form end  */}
          <AuthImagePattern title="Join our community" 
          subtitle="Connect with friends, share moments, and stay in touch with your loved ones."/>
      </div>
  )
}

export default SignUpPage