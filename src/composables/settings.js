import { get, getImagesGallery } from "@/api/settings";
import { useStorage } from "@vueuse/core";
import { readonly, ref } from "vue";
import { afterChange } from "./locale";

const settings = useStorage(
    'settings',
    undefined,
    undefined,
    {
        serializer: {
            read: (data) => {
                const { value, expired } = JSON.parse(data);
                if (expired > Date.now()) {
                    return value;
                }
                return {
                    socials: [],
                };
            },
            write: (value) => {
                return JSON.stringify({ value, expired: Date.now() + 3600000 })
            }
        }
    },
);

const error = ref(null);
const isLoading = ref(false);
const isLoaded = ref(settings.value?.socials.length > 0);

afterChange(() => {
    if (isLoaded.value) exec();
})
const exec = async () => {
    isLoading.value = true;
    await get().then(response => response.data).then(data => {
        settings.value = data;
        isLoading.value = false;
        isLoaded.value = true;
    }).catch(errorObj => {
        error.value = errorObj?.response?.data;
    });
}
export default function useSettings() {
    return {
        settings: readonly(settings),
        isLoaded: readonly(isLoaded),
        isLoading: readonly(isLoading),
        error: readonly(error),
        exec,
    };
}
