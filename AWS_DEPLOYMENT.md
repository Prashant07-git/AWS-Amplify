# AWS Free Deployment Guide

This app is a Next.js 14 SSR app with API routes, so use AWS Amplify Hosting. Keep Supabase exactly as it is; AWS only hosts the Next.js frontend and API routes.

## Recommended AWS Setup

- AWS service: Amplify Hosting
- Runtime: Managed Next.js SSR hosting
- Database/Auth/Storage: Existing Supabase project
- Payments: Existing Razorpay keys
- Email: Existing Resend key

Amplify supports Next.js SSR apps, API routes, dynamic routes, and static pages. That fits this app better than S3 static hosting because `app/api/*` must run on a server runtime.

## Free Cost Notes

For new AWS accounts after July 15, 2025, choose the AWS Free plan during signup. AWS says the Free plan runs for up to 6 months or until credits are used, and you are not charged unless you switch to the Paid plan.

Amplify Hosting has monthly free usage allowances, including build minutes, CDN storage, data transfer, SSR request count, and SSR duration. Stay inside those limits and keep the account on the Free plan to avoid charges.

Important: avoid adding paid extras like WAF, paid Route 53 hosted zones, NAT Gateway, RDS, ECR, ECS, or EC2 unless you intentionally upgrade later.

## Before You Deploy

1. Push this project to GitHub.
2. Make sure `.env.local` is not committed.
3. Rotate any real secret that was ever committed, especially:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RAZORPAY_KEY_SECRET`
   - `RESEND_API_KEY`
4. In Supabase, confirm your project is active and the database migration has been run.

## Amplify Deployment Steps

1. Open AWS Console.
2. Go to Amplify.
3. Choose `Deploy an app`.
4. Connect your GitHub repository.
5. Select the branch to deploy, usually `main`.
6. Amplify should detect Next.js. Keep the build settings from `amplify.yml`.
7. Add environment variables in Amplify:

```text
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_SITE_URL=https://your-amplify-domain
```

8. Deploy.
9. After deployment, update `NEXT_PUBLIC_SITE_URL` to the final Amplify URL and redeploy.
10. In Razorpay, add this webhook URL:

```text
https://your-amplify-domain/api/webhook
```

## Supabase Settings

In Supabase Auth settings, add your live Amplify URL:

```text
https://your-amplify-domain
```

If you use email redirects, also add the exact redirect URLs needed by your app.

## Staying Free

- Use the AWS Free plan if your account is new enough to have it.
- Add AWS Billing alerts for `0.01 USD`.
- Do not attach a custom domain through Route 53 unless you accept possible domain/hosted-zone costs.
- Use the free Amplify URL first.
- Keep traffic low while testing.
- Delete unused Amplify preview branches.
