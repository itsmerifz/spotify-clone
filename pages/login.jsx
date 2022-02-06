import { getProviders, signIn } from 'next-auth/react';

const Login = ({ providers }) => {
  return (
    <div className='flex flex-col min-h-screen items-center justify-center bg-black w-full'>
      <img src="https://links.papareact.com/9xl" alt="" className='w-52 mb-5' />
      {
        Object.values(providers).map(provider => (
          <div key={provider.name}>
            <button className='bg-[#18d860] text-white p-5 rounded-lg' onClick={() => signIn(provider.id, { callbackUrl: '/' })}>
              Login dengan {provider.name}
            </button>
          </div>
        ))
      }
    </div>
  )
};

export default Login;

export async function getServerSideProps(){
  const providers = await getProviders();

  return {
    props: {
      providers,
    }
  }
}
