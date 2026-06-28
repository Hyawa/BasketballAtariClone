# 🏀 Basketball Atari Multiplayer

Projeto desenvolvido com o objetivo de estudar **desenvolvimento de jogos multiplayer autoritativos utilizando Nakama**.

> **Este NÃO é um projeto comercial.**
>
> O objetivo principal é aprender arquitetura multiplayer, matchmaking, sincronização em tempo real, servidor autoritativo, MMR/PDL, Leaderboards e sistemas sociais semelhantes aos utilizados em jogos da Riot Games.

---

# Objetivos do Projeto

Este projeto serve como laboratório para aprender:

* Servidor Autoritativo com Nakama
* Matchmaking
* Sincronização em tempo real
* RPC
* Leaderboards
* Sistema de Ranking (MMR / PDL)
* Friends
* Chat
* Party System
* Arquitetura escalável para múltiplos jogos

O jogo escolhido para esse estudo é um **Basquete Arcade inspirado em jogos de Atari**.

---

# Filosofia do Projeto

Este projeto prioriza:

* Arquitetura limpa
* Separação de responsabilidades
* Código simples
* Componentes reutilizáveis
* Fácil manutenção
* Fácil evolução

A arquitetura foi planejada para permitir que novos jogos utilizem a mesma infraestrutura multiplayer.

---

# Stack

## Frontend

* TypeScript
* Webpack
* Phaser
* CSS

## Backend

* Nakama
* TypeScript (Runtime)
* PostgreSQL

---

# Arquitetura do Servidor

```text
src/

rpc/            -> Entrada do cliente (RPC)

matchmaking/    -> Sistema de filas

match/          -> Lógica das partidas (Servidor Autoritativo)

ranking/        -> MMR / PDL / Tiers

leaderboard/    -> Rankings públicos

friends/        -> Sistema de amizade

party/          -> Grupo de jogadores antes da partida

chat/           -> Chat

voice/          -> Comunicação por voz (opcional)

storage/        -> Persistência no PostgreSQL

shared/         -> Código compartilhado
```

Cada módulo possui apenas uma responsabilidade.

Exemplo:

* matchmaking nunca calcula MMR.
* ranking nunca controla partidas.
* match nunca acessa leaderboard diretamente.
* friends nunca conhece regras da partida.

Todos os módulos devem permanecer desacoplados.

---

# Arquitetura do Cliente

O cliente possui apenas três responsabilidades:

* Interface
* Renderização
* Captura do Input

Toda decisão importante acontece no servidor.

O cliente nunca decide:

* quem venceu
* quem fez ponto
* placar
* cronômetro
* regras da partida

Ele apenas envia comandos e desenha o estado recebido do servidor.

---

# Roadmap de Desenvolvimento

## Fase 1

Singleplayer

Objetivo:

Criar toda a lógica do jogo localmente.

Status:

✅ Concluído

---

## Fase 2

Multiplayer Lobby (Frontend)

Objetivo:

Construir toda a interface utilizando Mock Data.

Nenhuma comunicação com Nakama.

Inclui:

* Escolha de modo
* Ranked
* Normal Game
* 1v1
* 5v5
* Encontrar Partida
* Cancelar Fila
* Cronômetro da fila
* Lista de amigos
* Solicitações
* Chat (mock)
* Convites (mock)

Status:

🚧 Em desenvolvimento

---

## Fase 3

Sistema Social

Integração dos componentes sociais com Nakama.

Inclui:

* Friends
* Chat
* Convites
* Party

---

## Fase 4

Matchmaking

Objetivo:

Integrar o Lobby ao Nakama.

Fluxo esperado:

Jogador

↓

Seleciona modo

↓

Entrar na fila

↓

Matchmaking

↓

Recebe MatchId

↓

Entra na MultiplayerScene

---

## Fase 5

Multiplayer Autoritativo

Objetivo:

Sincronizar dois jogadores em tempo real.

Primeira versão:

* Movimento
* Direção
* Estado

Posteriormente:

* Bola
* Arremesso
* Colisão
* Cesta
* Placar
* Cronômetro

Tudo calculado pelo servidor.

---

## Fase 6

Ranking

Após cada partida:

Servidor

↓

Calcula vencedor

↓

Atualiza MMR

↓

Atualiza PDL

↓

Atualiza Tier

↓

Atualiza Leaderboard

Nenhuma informação de ranking é calculada pelo cliente.

---

# Futuro

Após o MVP funcionar completamente, poderão ser adicionados:

* Draft de posições para partidas 5v5
* Comunicação por voz
* Histórico de partidas
* Replay
* Estatísticas
* Perfil do jogador
* Conquistas
* Torneios

---

# Interface

A interface é inspirada em jogos competitivos modernos.

Referências:

* League of Legends
* Valorant

O objetivo não é copiar a interface desses jogos, mas utilizar princípios semelhantes de organização e experiência do usuário.

---

# Estrutura Geral

Singleplayer

↓

Lobby Multiplayer

↓

Sistema Social

↓

Matchmaking

↓

Partida Autoritativa

↓

Fim da Partida

↓

Ranking

↓

Leaderboard

---

# Regras de Desenvolvimento

Durante todo o projeto devem ser seguidas as seguintes diretrizes:

* Investigar a causa raiz antes de corrigir problemas.
* Evitar mudanças que quebrem funcionalidades existentes.
* Implementar alterações pequenas e incrementais.
* Não engolir exceções.
* Adicionar logs úteis durante o desenvolvimento.
* Componentizar a interface.
* Priorizar código reutilizável.
* Manter o servidor como autoridade do jogo.
* Separar claramente responsabilidades entre os módulos.
* Comentários apenas para regras de negócio ou decisões arquiteturais.

---

# Observação

Este projeto é exclusivamente educacional.

O objetivo principal não é construir um jogo comercial, mas compreender profundamente como arquitetar jogos multiplayer escaláveis utilizando Nakama e aplicar esses conhecimentos em projetos futuros.
