import logo from "@rahoot/web/assets/logo.svg";
import Loader from "@rahoot/web/features/game/components/Loader";
import { useSocket } from "@rahoot/web/features/game/contexts/socketProvider";
import { Outlet } from "react-router";
import { useTranslation } from "@rahoot/web/hooks/useTranslation";

const AuthLayout = () => {
  const { isConnected } = useSocket();
  const { t } = useTranslation();

  if (!isConnected) {
    return (
      <section className="relative z-20 flex min-h-dvh flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="bg-primary/15 absolute -top-[15vmin] -left-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full"></div>
          <div className="bg-primary/15 absolute -right-[15vmin] -bottom-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45"></div>
        </div>

        <img src={logo} className="mb-10 h-16 relative z-10" alt="logo" />
        <Loader className="h-23 relative z-10" />
        <h2 className="mt-2 relative z-10 text-center text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
          {t("common.loading")}
        </h2>
      </section>
    );
  }

  return (
    <section className="relative z-20 flex min-h-dvh flex-col items-center justify-center">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="bg-primary/15 absolute -top-[15vmin] -left-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full"></div>
        <div className="bg-primary/15 absolute -right-[15vmin] -bottom-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45"></div>
      </div>

      <img src={logo} className="mb-10 h-16 relative z-10" alt="logo" />
      <div className="relative z-10">
        <Outlet />
      </div>
    </section>
  );
};

export default AuthLayout;
