import { Input } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import authStore from "@store/AuthStore";
import { BaseButton } from "@components/atoms/Button/BaseButton";
import styles from "./AuthPage.module.scss";
import FinishPassword from "./FinishReset/FinishReset";
import Footer from "./Footer/Footer";
import GetCode from "./GetCode/GetCode";
import PasswordReset from "./PasswordReset/PasswordReset";

const AuthPage = observer(() => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const identifier = (event.target as HTMLFormElement).identifier.value;
    const password = (event.target as HTMLFormElement).password.value;

    try {
      await authStore.login(identifier, password);

      if (authStore.isLoggedIn) {
        navigate("/managers");
      }
    } catch (error: any) {
      if (error.status) {
        setError(
          ((error as Error).message = "Ошибка на сервере, попробуйте позже")
        );
      }
      setError(((error as Error).message = "Неправильные данные для входа"));
    }
  }
  return (
    <div className={styles.container}>
      <div
        className={styles.formWrapper}
        style={{ height: step == 1 ? "400px" : "320px" }}
      >
        <div
          className={styles.formScroller}
          style={{
            transform: `translateX(-${(step - 1) * 480}px)`,
          }}
        >
          <form className={styles.authForm} onSubmit={(e) => handleSubmit(e)}>
            <h4>Авторизация</h4>
            <p>Введите ваш номер телефона для входа в личный кабинет.</p>
            {error && <p className={styles.error}>{error}</p>}

            <Input
              className={styles["inputs"]}
              name="identifier"
              placeholder="Ваша Почта"
            />
            <div className={styles.passwordWrapper}>
              <Input
                className={styles["inputs"]}
                name="password"
                placeholder="Ваш Пароль"
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Скрыть" : "Показать"}
              </button>
            </div>
            <a onClick={() => setStep(2)} className={styles.forgetPassword}>
              Забыли пароль?
            </a>
            <BaseButton type="submit" variantColor="primary">
              {authStore.loading ? "Вход..." : "Войти"}
            </BaseButton>
          </form>
          <PasswordReset onNext={() => setStep(3)} onBack={() => setStep(1)} />
          <GetCode onNext={() => setStep(4)} onBack={() => setStep(2)} />
          <FinishPassword onNext={() => setStep(1)} onBack={() => setStep(3)} />
        </div>
      </div>
      <Footer />
    </div>
  );
});

export default AuthPage;
