import {defineConfig,loadEnv} from 'vite';

export default defineConfig(({mode})=>{
  const env=loadEnv(mode,process.cwd(),'VITE_');
  const tailscaleHost=env.VITE_TAILSCALE_HOST||'desktop-qagf7d0.tail106770.ts.net';
  return{
    server:{allowedHosts:[tailscaleHost]},
    preview:{allowedHosts:[tailscaleHost]},
  };
});
