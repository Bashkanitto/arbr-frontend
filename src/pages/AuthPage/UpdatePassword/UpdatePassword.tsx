import { Input } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { FormEvent } from "react";
import { BaseButton } from "@components/atoms/Button/BaseButton";
import styles from "./UpdatePassword.module.scss";

const UpdatePassword = observer(() => {
  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Логика сброса пароля
    console.log("Сброс пароля");
  };

  return (
    <form className={styles.updateForm} onSubmit={handleReset}>
      <div>
        <h4>Обновить пароль</h4>
        <p>
          Введите код, который мы вам отправили на адрес
          <br />
          отправим код .
        </p>
      </div>
      <div>
        <Input name="email" placeholder="Ваша почта" required />
        <BaseButton type="submit" variantColor="primary">
          Отправить код
        </BaseButton>
      </div>
    </form>
  );
});

export default UpdatePassword;
