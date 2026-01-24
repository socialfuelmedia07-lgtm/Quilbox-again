import React, { useState } from 'react';
import { X, Mail, Phone, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'identity' | 'otp' | 'profile';
type LoginMethod = 'email' | 'phone';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { login } = useAuth();
    const [step, setStep] = useState<Step>('identity');
    const [method, setMethod] = useState<LoginMethod>('email'); // Default to email
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        identity: '',
        otp: '',
        firstName: '',
        lastName: '',
        age: '',
    });

    if (!isOpen) return null;

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            setLoading(false);

            if (step === 'identity') {
                if (!formData.identity) {
                    toast.error(`Please enter your ${method}`);
                    return;
                }

                if (method === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(formData.identity)) {
                        toast.error("Please enter a valid email address");
                        return;
                    }
                } else {
                    const phoneRegex = /^\d{10}$/;
                    if (!phoneRegex.test(formData.identity)) {
                        toast.error("Please enter a valid 10-digit phone number");
                        return;
                    }
                }

                setStep('otp');
                toast.success(`OTP sent to your ${method}! (Code: 1234)`);
            }
            else if (step === 'otp') {
                if (!formData.otp) {
                    toast.error("Please enter the OTP");
                    return;
                }
                if (formData.otp !== '1234') {
                    toast.error("Invalid OTP. Please try again.");
                    return;
                }
                setStep('profile');
                toast.success("Identity verified successfully!");
            }
            else if (step === 'profile') {
                if (!formData.firstName) {
                    toast.error("First Name is required");
                    return;
                }
                if (!formData.age) {
                    toast.error("Age is required");
                    return;
                }

                login({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: method === 'email' ? formData.identity : undefined,
                    phoneNumber: method === 'phone' ? formData.identity : undefined,
                    age: formData.age
                });

                toast.success(`Welcome to QuilBox, ${formData.firstName}!`);
                onClose();
            }
        }, 800);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // If phone method, restrict to numbers only
        if (method === 'phone' && e.target.name === 'identity') {
            if (!/^\d*$/.test(val)) return;
        }
        setFormData({ ...formData, [e.target.name]: val });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-background border border-border rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">
                            {step === 'identity' && 'Sign In'}
                            {step === 'otp' && 'Verify OTP'}
                            {step === 'profile' && 'Complete Profile'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {step === 'identity' && 'Choose your preferred login method'}
                            {step === 'otp' && 'Enter the 4-digit code (Try: 1234)'}
                            {step === 'profile' && 'Tell us a bit about yourself'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <form onSubmit={handleNext} className="space-y-6">
                        {step === 'identity' && (
                            <div className="space-y-6">
                                {/* Login Method Tabs */}
                                <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => { setMethod('email'); setFormData({ ...formData, identity: '' }); }}
                                        className={cn(
                                            "flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all",
                                            method === 'email'
                                                ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setMethod('phone'); setFormData({ ...formData, identity: '' }); }}
                                        className={cn(
                                            "flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all",
                                            method === 'phone'
                                                ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <Phone className="w-4 h-4" />
                                        Phone
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            {method === 'email' ? (
                                                <Mail className="h-5 w-5 text-muted-foreground" />
                                            ) : (
                                                <Phone className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <input
                                            type={method === 'email' ? 'email' : 'tel'}
                                            name="identity"
                                            placeholder={method === 'email' ? "name@example.com" : "9876543210"}
                                            className="block w-full pl-11 pr-4 py-3 bg-muted/50 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                            value={formData.identity}
                                            onChange={handleChange}
                                            maxLength={method === 'phone' ? 10 : undefined}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'otp' && (
                            <div className="space-y-4">
                                <div className="relative text-center">
                                    <div className="flex justify-center gap-3">
                                        {[1, 2, 3, 4].map((i) => (
                                            <input
                                                key={i}
                                                type="text"
                                                maxLength={1}
                                                className="w-12 h-14 text-center text-2xl font-bold bg-muted/50 border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                                value={formData.otp[i - 1] || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (/^\d*$/.test(val)) {
                                                        const newOtp = formData.otp.split('');
                                                        newOtp[i - 1] = val;
                                                        setFormData({ ...formData, otp: newOtp.join('') });
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p className="mt-4 text-xs text-muted-foreground">
                                        Sent to <span className="font-bold">{formData.identity}</span>. <button type="button" onClick={() => { setStep('identity'); setFormData({ ...formData, otp: '' }); }} className="text-primary font-medium hover:underline">Change?</button>
                                    </p>
                                </div>
                            </div>
                        )}

                        {step === 'profile' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="John"
                                            className="block w-full px-4 py-3 bg-muted/50 border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Doe (Optional)"
                                            className="block w-full px-4 py-3 bg-muted/50 border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Age *</label>
                                    <input
                                        type="number"
                                        name="age"
                                        placeholder="e.g. 25"
                                        className="block w-full px-4 py-3 bg-muted/50 border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                        value={formData.age}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold group"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {step === 'profile' ? 'Create Account' : 'Continue'}
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Secure encryption & privacy protection</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
