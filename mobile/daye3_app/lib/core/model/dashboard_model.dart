class DashboardModel {
  final double totalRevenue;
  final int totalOrders;
  final List<ProductStat> topSelling;
  final List<ProductStat> leastSelling;
  final List<CategoryStat> categories;

  DashboardModel({
    required this.totalRevenue,
    required this.totalOrders,
    required this.topSelling,
    required this.leastSelling,
    required this.categories,
  });

  factory DashboardModel.fromJson(Map<String, dynamic> json) {
    return DashboardModel(
      totalRevenue: (json['totalRevenue'] ?? 0).toDouble(),
      totalOrders: json['totalOrders'] ?? 0,

      topSelling: (json['topSellingProducts'] as List? ?? [])
          .map((e) => ProductStat.fromJson(e))
          .toList(),

      leastSelling: (json['leastSellingProducts'] as List? ?? [])
          .map((e) => ProductStat.fromJson(e))
          .toList(),

      categories: (json['salesByCategory'] as List? ?? [])
          .map((e) => CategoryStat.fromJson(e))
          .toList(),
    );
  }
}

class ProductStat {
  final int productId;
  final int salesCount;
  final String name;

  ProductStat({
    required this.productId,
    required this.salesCount,
    required this.name,
  });

  factory ProductStat.fromJson(Map<String, dynamic> json) {
    return ProductStat(
      productId: json['product_id'] ?? 0,
      salesCount: int.tryParse(json['salesCount'].toString()) ?? 0,
      name: json['product']?['name'] ?? "Unknown",
    );
  }
}

class CategoryStat {
  final String category;
  final int totalSales;

  CategoryStat({
    required this.category,
    required this.totalSales,
  });

  factory CategoryStat.fromJson(Map<String, dynamic> json) {
    return CategoryStat(
      category: json['category'] ?? "",
      totalSales: int.tryParse(json['totalSales'].toString()) ?? 0,
    );
  }
}