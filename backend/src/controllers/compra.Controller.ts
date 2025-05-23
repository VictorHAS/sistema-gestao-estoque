import { Request, Response } from 'express';
import { CompraService } from '../services/compra.service';
import { StatusPedido } from '../generated/prisma';

const compraService = new CompraService();

export class CompraController {
    static async listarTodas(req: Request, res: Response): Promise<void> {
        try {
            const compras = await compraService.listarTodas();
            res.json(compras);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ mensagem: 'Erro ao listar compras', erro: error.message });
            } else {
                res.status(500).json({ mensagem: 'Erro desconhecido ao listar compras' });
            }
        }
    }

    static async obterPorId(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const compra = await compraService.obterPorId(id);
            if (!compra) {
                res.status(404).json({ mensagem: 'Compra não encontrada' });
                return;
            }
            res.json(compra);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ mensagem: 'Erro ao obter compra', erro: error.message });
            } else {
                res.status(500).json({ mensagem: 'Erro desconhecido ao obter compra' });
            }
        }
    }

    static async criar(req: Request, res: Response): Promise<void> {
        try {
            const compra = await compraService.criar(req.body);
            res.status(201).json(compra);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ mensagem: 'Erro ao criar compra', erro: error.message });
            } else {
                res.status(500).json({ mensagem: 'Erro desconhecido ao criar compra' });
            }
        }
    }

    static async atualizarStatus(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { status } = req.body;

        try {
            if (!Object.values(StatusPedido).includes(status)) {
                res.status(400).json({ mensagem: 'Status inválido' });
                return;
            }

            const compraAtualizada = await compraService.atualizarStatus(id, { status });
            res.json(compraAtualizada);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({
                    mensagem: 'Erro ao atualizar status da compra',
                    erro: error.message,
                });
            } else {
                res.status(500).json({
                    mensagem: 'Erro desconhecido ao atualizar status da compra',
                });
            }
        }


  static async excluir(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            await compraService.excluir(id);
            res.status(204).send();
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ mensagem: 'Erro ao excluir compra', erro: error.message });
            } else {
                res.status(500).json({ mensagem: 'Erro desconhecido ao excluir compra' });
            }
        }
    }
}
