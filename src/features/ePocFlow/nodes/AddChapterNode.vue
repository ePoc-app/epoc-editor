<template>
    <div class="add-chapter">
        <button class="add-btn"><i class="icon-plus"></i></button>
    </div>
</template>

<style scoped lang="scss">
.add-btn {
    border-radius: 50%;
    height: 30px;
    width: 30px;
    background-color: var(--content);
    border: 1px solid var(--border);
    font-size: .7rem;
    cursor: pointer;
    transition: box-shadow .1s ease-in-out;
    &:hover {
        box-shadow: 0 1px 5px var(--shadow-outer);
    }
    &:active {
        opacity: .7;
    }
}
</style>