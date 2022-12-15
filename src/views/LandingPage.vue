<script setup lang="ts">

const epocs = [
    {
        name: 'epoc sans titre 1.epoc',
        modified: '2021-05-12'
    }, 
    {
        name: 'epoc sans titre 2.epoc',
        modified: '2021-05-12'
    }, 
    {
        name: 'epoc sans titre 3.epoc',
        modified: '2021-05-12'
    },
    {
        name:'epoc sans titre 4.epoc',
        modified: '2021-05-12'
    },
    {
        name: 'epoc sans titre 5.epoc',
        modified: '2021-05-12'
    }
];

</script>

<template>
    <div class="card card-large">
        <div class="logo">
            <img src="../assets/img/epoc.svg" />
            <img src="../assets/img/inria.svg" />
        </div>
        <div class="buttons">
            <button class="btn btn-outline btn-large">
                <i class="icon-ouvrir" />
                Ouvrir un projet existant
            </button>
            <button class="btn btn-outline btn-large">
                <i class="icon-creer" />
                Créer un nouveau projet
            </button>
        </div>
        <div>
            <h3>Fichiers récents</h3>
            <hr class="separator" />
            <div v-for="epoc of epocs" :key="epoc.name" class="card-list-item">
                <div class="card-icon">
                    <i class="icon-fichier" />
                </div>
                <p>{{ epoc.name }}</p>
                <small>Modifié le {{ epoc.modified }}</small>
                <hr class="vertical-separator" />
                <div class="btn-open">
                    Ouvrir
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.card {
    font-weight: bold;
    .btn-open {
        color: var(--inria-red);
        margin-right: 1rem;
        cursor: pointer;
    }
    h3 {
        margin-bottom: .7rem;
    }
    
    .logo, .buttons {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
    }

}
</style>