<script setup>
import { onMounted } from 'vue';
import { DonutChart } from '@/components/ui/chart-donut';
import { AreaChart } from '@/components/ui/chart-area';
import { LineChart } from '@/components/ui/chart-line';
import { BarChart } from '@/components/ui/chart-bar'
import { useStatisticsStore } from '@/stores/statistics';
import { useAuthStore } from '@/stores/auth';

const statisticsStore = useStatisticsStore();
const authStore = useAuthStore();

onMounted(async () => {
    statisticsStore.statisticsAll();

    if (authStore.user && authStore.user.type === 'A') {
        statisticsStore.statisticsAdmin();
    }

});

</script>

<template>
    <div class="statistics-page">
        <h1 class="title">Statistics</h1>
        <div class="statistics-container"
            :class="{ 'single-section-container': (!authStore.user || authStore.user.type !== 'A') }">
            <div class="space-row" :class="{ 'single-section': !authStore.user || authStore.user.type !== 'A' }">
                <div v-if="statisticsStore.generalStats" class="statistics-section">
                    <h2 class="section-title">General Data</h2>
                    <p class="stat-item">Total Users: <span>{{ statisticsStore.generalStats.total_users }}</span></p>
                    <p class="stat-item">Total Games: <span>{{ statisticsStore.generalStats.total_games_played }}</span>
                    </p>
                    <p class="stat-item">Games in the Last Week: <span>{{ statisticsStore.generalStats.games_last_week
                            }}</span></p>
                    <p class="stat-item">Games in the Last Month: <span>{{ statisticsStore.generalStats.games_last_month
                            }}</span></p>
                </div>

                <div v-if="authStore.user && authStore.user.type === 'A'">
                    <div v-if="statisticsStore.adminStats" class="statistics-section">
                        <h2 class="section-title">Administrator Statistics</h2>
                        <p class="stat-item">Total Purchases: <span>{{ statisticsStore.adminStats.total_purchases
                                }}</span></p>
                        <p class="stat-item">Purchases in the Last Week: <span>{{
                            statisticsStore.adminStats.purchases_last_week }}</span></p>
                        <p class="stat-item">Total actives players last week: <span>{{
                            statisticsStore.adminStats.total_active_players_last_week }}</span></p>
                        <p class="stat-item">Total register players: <span>{{
                            statisticsStore.adminStats.total_register_players }}</span></p>
                    </div>
                </div>
            </div>
            <div v-if="authStore.user && authStore.user.type === 'A'">
                <div class="space-row">
                    <div>
                        <h2 class="section-title">Coins Purchased Per Month</h2>
                        <div class="chart-container"
                            v-if="statisticsStore.coinsPerMonth && statisticsStore.coinsPerMonth.length">

                            <BarChart index="month" :data="statisticsStore.coinsPerMonth" :colors="['#4682B4']"
                                :categories="['total_coins']" :y-formatter="(tick, i) => {
                                    return typeof tick === 'number'
                                        ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
                                        : ''
                                }" :rounded-corners="4" :showXAxis="true" :showYAxis="true" />
                        </div>
                    </div>
                    <div>
                        <h2 class="section-title">Payment type popularity</h2>
                        <div class="chart-container" v-if="statisticsStore.popularPurchaseMethod">

                            <DonutChart index="payment_type" :category="'total_purchases'"
                                :data="statisticsStore.popularPurchaseMethod"
                                :colors="['#FF6347', '#4682B4', '#00FF7F', '#6A5ACD', '#FFD700']" :showLegend="true" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-row">
                <div>
                    <h2 class="section-title">Games per month</h2>
                    <div class="chart-container" v-if="statisticsStore.gamesPerMonth">
                        <AreaChart :data="statisticsStore.gamesPerMonth" index="month"
                            :categories="['singleplayer', 'multiplayer']" :colors="['#ff6347', '#4682b4']"
                            :showXAxis="true" :showYAxis="true" />
                    </div>
                </div>
                <div>
                    <h2 class="section-title">Games Per Board</h2>
                    <div class="chart-container" v-if="statisticsStore.boardData && statisticsStore.boardData.length">
                        <DonutChart index="board_size" :colors="['#ff6347', '#4682b4', '#00e5ff']"
                            :category="'total_games'" :data="statisticsStore.boardData" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.statistics-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    background: linear-gradient(135deg, rgb(3, 0, 19), #131329);
    color: #ffffff;
    font-family: 'Poppins', sans-serif;
}

.title {
    font-size: 3rem;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.9);
    margin-bottom: 60px;
}

.statistics-container {
    width: 100%;
    max-width: 90%;
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.6);
}

.statistics-container.single-section-container {
    width: 80%;
}

.statistics-section {
    flex: 1;
    min-width: 0;
    background: linear-gradient(135deg, #1e1e2e, #27293d);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
}

.section-title {
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
}

.stat-item {
    font-size: 1.2rem;
    margin: 10px 0;
    color: #ffffff;
}

.stat-item span {
    font-weight: bold;
    color: #00e5ff;
}

.statistics-section:hover {
    transform: translateY(-5px);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.6);
    transition: all 0.3s ease-in-out;
}

.space-row {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    width: 100%;
}

.space-row>div {
    flex: 1;
    max-width: 50%;
    box-sizing: border-box;
}

.space-row.single-section>div {
    flex: 0 0 100%;
    max-width: 100%;
}

.chart-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    height: 80%;
}

h2 {
    margin-top: 20px;
    text-align: center;
}
</style>