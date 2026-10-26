import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toMonthKey } from "@/helpers/month";
import { TransactionManager } from "./index";
import type { TransactionItem, TransactionManagerStore } from "./types";

type Receivable = TransactionItem & { id_receivable: string };
type Manager = TransactionManagerStore<Receivable, "id_receivable">;

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const createManager = (overrides: Partial<Manager> = {}): Manager => ({
  items: [],
  isLoading: false,
  idUserWallet: "wallet-1",
  onCreate: jest.fn().mockResolvedValue({}),
  onUpdate: jest.fn().mockResolvedValue({}),
  onDelete: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

const renderManager = (manager: Manager, withFrequency = false) =>
  render(
    <TransactionManager
      targetLabel="Recebíveis"
      idKey="id_receivable"
      manager={manager}
      withFrequency={withFrequency}
    />,
  );

describe("TransactionManager", () => {
  it("shows validation errors and does not save an empty form", async () => {
    const manager = createManager();
    renderManager(manager);

    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(await screen.findByText("Descrição é obrigatória.")).toBeInTheDocument();
    expect(screen.getByText("O valor deve ser maior que 0.")).toBeInTheDocument();
    expect(manager.onCreate).not.toHaveBeenCalled();
  });

  it("creates a transaction with the parsed amount and clears the form", async () => {
    const manager = createManager();
    renderManager(manager);

    await userEvent.type(screen.getByPlaceholderText("Ex: Recebimento ou Gasto"), "Freela");
    // The currency mask fills from the cents: "150000" -> "1.500,00"
    await userEvent.type(screen.getByPlaceholderText("0,00"), "150000");
    expect(screen.getByPlaceholderText("0,00")).toHaveValue("1.500,00");

    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    await waitFor(() => expect(manager.onCreate).toHaveBeenCalled());
    expect(manager.onCreate).toHaveBeenCalledWith({
      id_user_wallet: "wallet-1",
      ds_description: "Freela",
      vl_amount: 1500,
      vl_day: new Date().getDate(),
    });
    await waitFor(() =>
      expect(screen.getByPlaceholderText("Ex: Recebimento ou Gasto")).toHaveValue(""),
    );
  });

  it("sends the frequency when the manager repeats monthly", async () => {
    const manager = createManager();
    renderManager(manager, true);

    expect(screen.getByLabelText("Frequência")).toBeInTheDocument();
    expect(screen.getByLabelText("A partir de")).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText("Ex: Recebimento ou Gasto"), "Salário");
    await userEvent.type(screen.getByPlaceholderText("0,00"), "500000");
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    await waitFor(() => expect(manager.onCreate).toHaveBeenCalled());
    expect(manager.onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        vl_amount: 5000,
        dt_start_month: toMonthKey(new Date()),
        nr_months: null,
      }),
    );
  });

  it("updates the edited item by its id", async () => {
    const manager = createManager({
      items: [
        {
          id_receivable: "r1",
          id_user_wallet: "wallet-1",
          ds_description: "Aluguel recebido",
          vl_amount: 900,
          vl_day: 10,
        },
      ],
    });
    renderManager(manager);

    await userEvent.click(screen.getByTitle("Editar"));

    const description = screen.getByPlaceholderText("Ex: Recebimento ou Gasto");
    expect(description).toHaveValue("Aluguel recebido");
    await userEvent.clear(description);
    await userEvent.type(description, "Aluguel");
    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(manager.onUpdate).toHaveBeenCalled());
    expect(manager.onUpdate).toHaveBeenCalledWith({
      id_receivable: "r1",
      ds_description: "Aluguel",
      vl_amount: 900,
      vl_day: 10,
    });
    expect(manager.onCreate).not.toHaveBeenCalled();
  });

  it("lists the registered items", () => {
    const manager = createManager({
      items: [
        {
          id_receivable: "r1",
          ds_description: "Aluguel recebido",
          vl_amount: 900,
          vl_day: 10,
        },
      ],
    });
    renderManager(manager);

    expect(screen.getByText("Recebíveis Cadastrados")).toBeInTheDocument();
    expect(screen.getByText("Aluguel recebido")).toBeInTheDocument();
  });
});
