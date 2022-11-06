# stevenfabre.com

- Real-time collaboration: [Liveblocks](https://liveblocks.io/)
- Framework: [Next.js](https://nextjs.org/)
- Deployment: [Vercel](https://vercel.com)
- Styling: [Tailwind CSS](https://tailwindcss.com/)

## Running locally

To run locally, you’ll first need to [create a Liveblocks account](https://liveblocks.io/api/auth/signup) to get a new secret key generated.

Once you’ve generated [the secret key](https://liveblocks.io/dashboard/apikeys), create a `.env.local` file and assign it to the`LIVEBLOCKS_SECRET_KEY` variable.

You can then run the following commands in your terminal:

```bash
git clone https://github.com/stevenfabre/stevenfabre.com.git
cd stevenfabre.com
npm install
npm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
