import SignInRedirect from './redirect';

export default function SignInPage() {
  return <SignInRedirect />;
}
          <div className="text-xs text-fg-muted flex flex-wrap items-center gap-2">
            <span className="opacity-70">Forgot your password?</span>
            <span className="text-fg-muted/60">Password reset coming soon</span>
          </div>
          <div className="text-xs text-fg-muted/80">
            Don&apos;t have an account? <Link href={"/auth/signup" as any} className="underline font-medium hover:text-fg">Sign up</Link>
          </div>
        </div>
        <EnvNotice />
      </div>
    </div>
  );
}
