import MemoExample from "../components/hooks/memoExample";
import Parent from "../components/hooks/callbackExamle";
import FocusInput from "../components/hooks/FocusInput";
import ThemePreference from "../components/hooks/ThemePreference";
import UserExample from "../components/hooks/UsersExample";

export default function Hooks() {
  return (
    <main className="hooks-page">
      <h1>Hooks Example</h1>
      <hr />

      <MemoExample />
      <hr />

      <Parent />
      <hr />

      <FocusInput />
      <hr />

      <ThemePreference />
      <hr />

      <UserExample />
    </main>
  );
}