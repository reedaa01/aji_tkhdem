'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';
import { authService } from '@/lib/services';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authService.login(data);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.full_name}!`);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">        <Link href="/" className="inline-flex items-center mb-6">
          <Image src="/Logo.png" alt="Aji Tkhdem" width={140} height={44} className="object-contain" />
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: '#2C4A6D' }}>Welcome back</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Sign in to your account</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg border p-8" style={{ borderColor: '#E5E7EB' }}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            placeholder="Your password"
            icon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: '#6B7280' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium hover:underline" style={{ color: '#1F6FAF' }}>
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
