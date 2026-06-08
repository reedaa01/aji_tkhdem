export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #E8F2FB 0%, #ffffff 50%, #FEF0E7 100%)' }}>
      {children}
    </div>
  );
}
