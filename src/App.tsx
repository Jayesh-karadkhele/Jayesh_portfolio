import { lazy, Suspense, useState } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";
import IntroScroll from "./components/IntroScroll";

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return <IntroScroll onFinish={() => setShowIntro(false)} />;
  }

  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            <Suspense>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
