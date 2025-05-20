import { useRouter } from "next/navigation";
import NProgress from "nprogress";

const useGoBack = () => {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) {
      router.back(); // Navigate to the previous route
    } else {
           NProgress.start();
      
      router.push("/"); // Redirect to home if no history exists
    }
  };

  return goBack;
};

export default useGoBack;
