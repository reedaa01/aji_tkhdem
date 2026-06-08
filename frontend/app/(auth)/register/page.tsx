'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mail, Lock, User } from 'lucide-react';
import { authService } from '@/lib/services';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const schema = z
  .object({
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/\d/, 'Password must contain at least one number'),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authService.register({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      });
      login(res.data.token, res.data.user);
      toast.success('Welcome to Aji Tkhdem! 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">        <Link href="/" className="inline-flex items-center mb-6">
          <Image src="/Logo.png" alt="Aji Tkhdem" width={140} height={44} className="object-contain" />
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: '#2C4A6D' }}>Create your account</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Start your career journey today</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg border p-8" style={{ borderColor: '#E5E7EB' }}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Full Name"
            placeholder="John Doe"
            icon={<User className="w-4 h-4" />}
            error={errors.full_name?.message}
            {...register('full_name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min 8 chars, include a number"
            icon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            icon={<Lock className="w-4 h-4" />}
            error={errors.confirm_password?.message}
            {...register('confirm_password')}
          />
          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: '#6B7280' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-medium hover:underline" style={{ color: '#1F6FAF' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
