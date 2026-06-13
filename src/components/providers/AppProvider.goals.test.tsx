import { useContext } from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AppProvider, FootprintStateContext, FootprintDispatchContext } from "./AppProvider";

function GoalsConsumer() {
  const state = useContext(FootprintStateContext);
  const dispatch = useContext(FootprintDispatchContext);
  if (!state || !dispatch) return <div data-testid="err">noctx</div>;

  const addGoal = () =>
    dispatch.addGoal({
      id: "g1",
      title: "G1",
      category: "total",
      targetValue: 100,
      progress: 0,
      active: true,
      createdAt: new Date().toISOString()
    });
  const toggle = () => dispatch.toggleGoalActive("g1");
  const addChallenge = () =>
    dispatch.addChallenge({
      id: "c1",
      title: "C1",
      description: "d",
      durationDays: 7,
      completed: false,
      createdAt: new Date().toISOString()
    });
  const complete = () => dispatch.completeChallenge("c1");

  return (
    <div>
      <div data-testid="goals">{state.goals.length}</div>
      <div data-testid="challenges">{state.challenges.length}</div>
      <div data-testid="goal-active">{state.goals[0]?.active ? "1" : "0"}</div>
      <div data-testid="challenge-completed">{state.challenges[0]?.completed ? "1" : "0"}</div>
      <button onClick={addGoal} data-testid="add-goal">
        add-goal
      </button>
      <button onClick={toggle} data-testid="toggle-goal">
        toggle-goal
      </button>
      <button onClick={addChallenge} data-testid="add-challenge">
        add-challenge
      </button>
      <button onClick={complete} data-testid="complete-challenge">
        complete-challenge
      </button>
    </div>
  );
}

describe("AppProvider goals & challenges", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("adds, toggles and completes goals/challenges", async () => {
    render(
      <AppProvider>
        <GoalsConsumer />
      </AppProvider>
    );

    expect(screen.getByTestId("goals").textContent).toBe("0");

    await act(async () => {
      screen.getByTestId("add-goal").click();
    });
    expect(screen.getByTestId("goals").textContent).toBe("1");
    expect(screen.getByTestId("goal-active").textContent).toBe("1");

    await act(async () => {
      screen.getByTestId("toggle-goal").click();
    });
    expect(screen.getByTestId("goal-active").textContent).toBe("0");

    await act(async () => {
      screen.getByTestId("add-challenge").click();
    });
    expect(screen.getByTestId("challenges").textContent).toBe("1");

    await act(async () => {
      screen.getByTestId("complete-challenge").click();
    });
    expect(screen.getByTestId("challenge-completed").textContent).toBe("1");
  });
});
