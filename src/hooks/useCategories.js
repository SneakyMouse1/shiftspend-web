import { useState, useEffect } from "react";
import { getCategoriesApi, updateCategoryApi, deleteCategoryApi, createCategoryApi } from "@/api/categories";
import { toast } from "sonner";

export function useCategories() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const data = await getCategoriesApi();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Failed to load categories");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Create category
    const createCategory = async (newCategoryData) => {
        try {
            const data = await createCategoryApi({
                name: newCategoryData.name,
                icon: newCategoryData.icon,
                color: newCategoryData.color,
                type: newCategoryData.type, // 'expense' или 'income'
            });

            // Добавляем новую категорию в локальное состояние
            setCategories((prev) => [...prev, data]);
            toast.success("Category created successfully!");
            return true;
        } catch (error) {
            console.error("Error creating category:", error);
            toast.error("Failed to create category");
            return false;
        }
    };

    // Update category  
    const updateCategory = async (id, updatedData) => {
        try {
            const data = await updateCategoryApi(id, {
                name: updatedData.name,
                icon: updatedData.icon,
                color: updatedData.color,
                type: updatedData.type,
            });

            setCategories((prev) =>
                prev.map((cat) => (cat.id === id ? data : cat))
            );
            toast.success("Category updated successfully!");
            return true;
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Failed to save changes");
            return false;
        }
    };

    // Delete category
    const deleteCategory = async (id) => {
        try {
            await deleteCategoryApi(id);
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
            toast.success("Category deleted");
            return true;
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category");
            return false;
        }
    };

    return {
        categories,
        isLoading,
        createCategory,
        updateCategory,
        deleteCategory
    };
}